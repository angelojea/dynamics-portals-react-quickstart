using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Messages;
using Microsoft.Xrm.Sdk.Metadata;
using Microsoft.Xrm.Sdk.Query;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AOJ.Plugins
{
    public class CreatePreOp : IPlugin
    {
        private const int CreateOpertaion = 1;
        private const int UpdateOpertaion = 2;
        private const int DeleteOpertaion = 3;
        private const int ActionOpertaion = 4;

        private const string onBehalfOfField = "aoj_onbehalfof";
        private const string jsonField = "aoj_json";
        private const string operationTypeField = "aoj_operationtype";
        private const string createdRecordIdField = "aoj_createdrecordid";

        IOrganizationService svc;

        public void Execute(IServiceProvider serviceProvider)
        {

            var tracingService = (ITracingService)serviceProvider.GetService(typeof(ITracingService));
            var context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
            var serviceFactory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
            svc = serviceFactory.CreateOrganizationService(context.UserId);

            var target = (Entity)context.InputParameters["Target"];

            try
            {
                var records = JArray.Parse(target[jsonField].ToString());
                var requests = new ExecuteMultipleRequest()
                {
                    Requests = new OrganizationRequestCollection(),
                    Settings = new ExecuteMultipleSettings() { ContinueOnError = false, ReturnResponses = true }
                };

                foreach (var json in records.Children<JObject>())
                {
                    if (json["entity"] == null)
                    {
                        throw new Exception("Missing \"entity\" field on payload");
                    }
                    var entity = json["entity"].ToString();
                    var operationType = ((OptionSetValue)target[operationTypeField]);
                    var id = json["id"] != null ? json["id"].ToString() : "";

                    // If it's Create or Update and it's missing payload
                    if ((operationType.Value == CreateOpertaion || operationType.Value == UpdateOpertaion) && json["payload"] == null)
                    {
                        throw new Exception("Missing one of the required properties in JSON");
                    }

                    // If it's Update or Delete and it's missing id
                    if ((operationType.Value == UpdateOpertaion || operationType.Value == DeleteOpertaion) && json["id"] == null)
                    {
                        throw new Exception("Missing one of the required properties in JSON");
                    }

                    if (operationType.Value == ActionOpertaion)
                    {
                        var actionName = json["actionName"].ToString();
                        var action = new OrganizationRequest(actionName);
                        var actionPayload = JObject.Parse(json["payload"].ToString());

                        _resolvePayloadToRecord(actionPayload, action: action, target: target);

                        svc.Execute(action);
                        continue;
                    }

                    Entity record;

                    switch (operationType.Value)
                    {
                        // Create
                        case CreateOpertaion:
                            record = new Entity(entity);
                            break;
                        // Update
                        case UpdateOpertaion:
                            record = new Entity(entity, Guid.Parse(id));
                            break;
                        // Delete
                        case DeleteOpertaion:
                            requests.Requests.Add(
                                new DeleteRequest() { Target = new EntityReference(entity, Guid.Parse(id)) }
                            );
                            //svc.Execute(requests);
                            continue;
                        default: return;
                    }

                    var payload = JObject.Parse(json["payload"].ToString());

                    _resolvePayloadToRecord(payload, entity: record, target: target);

                    if (operationType.Value == CreateOpertaion)
                    {
                        requests.Requests.Add(new CreateRequest() { Target = record });
                    }
                    else
                    {
                        requests.Requests.Add(new UpdateRequest() { Target = record });
                    }
                }

                var multipleResponses = (ExecuteMultipleResponse)svc.Execute(requests);


                tracingService.Trace(Newtonsoft.Json.JsonConvert.SerializeObject(multipleResponses));

                if (multipleResponses.IsFaulted)
                {
                    var errorMsg = "";
                    for (int i = 0; i < multipleResponses.Responses.Count; i++)
                    {
                        var x = multipleResponses.Responses[i];
                        if (x.Fault != null)
                        {
                            errorMsg += "Line " + (i + 1) + ": " + x.Fault.Message + "\n";
                        }
                    }
                    throw new Exception(errorMsg);
                }

                // Fills the created record id field in case it's a CREATE operation
                for (int i = 0; i < multipleResponses.Responses.Count; i++)
                {
                    var responseItem = (ExecuteMultipleResponseItem)multipleResponses.Responses[i];
                    if (responseItem.Response is CreateResponse)
                    {
                        tracingService.Trace("Id: " + ((CreateResponse)responseItem.Response).id.ToString());
                        target[createdRecordIdField] = ((CreateResponse)responseItem.Response).id.ToString();
                    }
                }
            }
            catch (Exception ex)
            {
                tracingService.Trace(ex.Message + ":\n" + ex.StackTrace);

                throw new Exception(ex.Message);
            }
        }

        private void _resolvePayloadToRecord(JObject payload, Entity entity = null, OrganizationRequest action = null, Entity target = null)
        {
            if (entity == null && action == null) return;

            Entity snapshotRecord = null;

            if (entity != null && entity.Id != null)
            {
                var currentRecords = svc.RetrieveMultiple(new FetchExpression(@"
                <fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='false'>
                    <entity name='" + entity.LogicalName + @"'>
                        " + string.Join("", payload.Properties().Select(x => "<attribute name='" + x.Name.ToString() + "' />").ToList()) + @"
                        <filter type='and'>
                            <condition attribute='" + entity.LogicalName + @"id' operator='eq' value='" + entity.Id.ToString() + @"' />
                        </filter>
                    </entity>
                </fetch>"));
                if (currentRecords.Entities.Count > 0)
                    snapshotRecord = currentRecords.Entities[0];
            }

            var record = new Dictionary<string, object>();

            foreach (var prop in payload.Properties())
            {
                var propValue = prop.Value.ToString().Trim();
                if (propValue.StartsWith("{") && propValue.EndsWith("}"))
                {
                    var complexProp = JObject.Parse(propValue);
                    if (complexProp["type"] == null) continue;
                    switch (complexProp["type"].ToString())
                    {
                        case "optionset":
                            if (string.IsNullOrWhiteSpace(complexProp["value"].ToString()))
                            {
                                record[prop.Name] = null;
                                break;
                            }

                            var optionSetValue = new OptionSetValue(int.Parse(complexProp["value"].ToString()));
                            if (snapshotRecord != null)
                            {
                                if (!snapshotRecord.Contains(prop.Name) ||
                                snapshotRecord[prop.Name] == null ||
                                ((OptionSetValue)snapshotRecord[prop.Name]).Value != optionSetValue.Value)
                                {
                                    record[prop.Name] = optionSetValue;
                                }
                            }
                            else
                                record[prop.Name] = optionSetValue;
                            break;
                        case "date":
                            if (string.IsNullOrWhiteSpace(complexProp["value"].ToString()))
                            {
                                record[prop.Name] = null;
                                break;
                            }

                            var dateValue = DateTime.Parse(complexProp["value"].ToString());
                            if (snapshotRecord != null)
                            {
                                if (!snapshotRecord.Contains(prop.Name) ||
                                snapshotRecord[prop.Name] == null ||
                                DateTime.Parse(snapshotRecord[prop.Name].ToString()) != dateValue)
                                {
                                    record[prop.Name] = dateValue;
                                }
                            }
                            else
                                record[prop.Name] = dateValue;
                            break;
                        case "integer":
                            if (string.IsNullOrWhiteSpace(complexProp["value"].ToString()))
                            {
                                record[prop.Name] = null;
                                break;
                            }

                            var integerValue = int.Parse(complexProp["value"].ToString());
                            if (snapshotRecord != null)
                            {
                                if (!snapshotRecord.Contains(prop.Name) ||
                                snapshotRecord[prop.Name] == null ||
                                int.Parse(snapshotRecord[prop.Name].ToString()) != integerValue)
                                {
                                    record[prop.Name] = integerValue;
                                }
                            }
                            else
                                record[prop.Name] = integerValue;
                            break;
                        case "boolean":
                            if (string.IsNullOrWhiteSpace(complexProp["value"].ToString()))
                            {
                                record[prop.Name] = false;
                                break;
                            }

                            var boolValue = Boolean.Parse(complexProp["value"].ToString());
                            if (snapshotRecord != null)
                            {
                                if (!snapshotRecord.Contains(prop.Name) ||
                                snapshotRecord[prop.Name] == null ||
                                Boolean.Parse(snapshotRecord[prop.Name].ToString()) != boolValue)
                                {
                                    record[prop.Name] = boolValue;
                                }
                            }
                            else
                                record[prop.Name] = boolValue;
                            break;
                        case "entity-reference":
                            if (string.IsNullOrWhiteSpace(complexProp["id"].ToString()))
                            {
                                record[prop.Name] = null;
                                break;
                            }

                            var entityReference = new EntityReference(complexProp["entity"].ToString(), Guid.Parse(complexProp["id"].ToString()));
                            if (snapshotRecord != null)
                            {
                                if (!snapshotRecord.Contains(prop.Name) ||
                                snapshotRecord[prop.Name] == null ||
                                ((EntityReference)snapshotRecord[prop.Name]).Id != entityReference.Id)
                                {
                                    record[prop.Name] = entityReference;
                                }
                            }
                            else
                                record[prop.Name] = entityReference;
                            break;
                        case "portal-request":
                            if (target != null) record[prop.Name] = target.Id.ToString();
                            else record[prop.Name] = "Failed to load note";
                            break;
                        case "image":
                            if (string.IsNullOrWhiteSpace(complexProp["content"].ToString()))
                            {
                                record[prop.Name] = null;
                                break;
                            }

                            record[prop.Name] = Convert.FromBase64String(complexProp["content"].ToString());
                            break;
                    }

                    continue;
                }
                if (propValue == "True" || propValue == "False")
                {
                    var booleanValue = bool.Parse(propValue);
                    if (snapshotRecord != null)
                    {
                        if (!snapshotRecord.Contains(prop.Name) ||
                        snapshotRecord[prop.Name] == null ||
                        bool.Parse(snapshotRecord[prop.Name].ToString()) != booleanValue)
                        {
                            record[prop.Name] = booleanValue;
                        }
                    }
                    else record[prop.Name] = booleanValue;
                    continue;
                }

                if (snapshotRecord != null)
                {
                    if (!snapshotRecord.Contains(prop.Name) ||
                    snapshotRecord[prop.Name] == null ||
                    snapshotRecord[prop.Name].ToString() != propValue)
                    {
                        record[prop.Name] = propValue;
                    }
                }
                else record[prop.Name] = propValue;
            }

            foreach (var key in record.Keys)
            {
                if (entity != null) entity[key] = record[key];
                if (action != null) action[key] = record[key];
            }
        }
    }
}
