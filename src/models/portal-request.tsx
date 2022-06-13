export interface CreatePortalRequest extends PortalRequest {
    payload: object,
}

export interface UpdatePortalRequest extends PortalRequest {
    id: string,
    payload: object,
}
export interface DeletePortalRequest extends PortalRequest {
    id: string,
}

export interface ActionPortalRequest extends PortalRequest {
    actionName: string,
    payload: object,
}

interface PortalRequest {
    entity: Entity,
}

export enum Entity {
    Note = 'annotation',
    Account = 'account',
    Building = 'smp_building',
    Contact = 'contact',
    ItemAndQuantity = 'smp_itemandquantity',
    Room = 'smp_room',
    ServiceRequest = 'smp_servicerequest',
}

export interface OptionSetField extends ComplexField {
    value: string
}

export interface EntityReferenceField extends ComplexField {
    id: string,
    entity: Entity
}

export interface DateField extends ComplexField {
    value: string
}

export interface IntegerField extends ComplexField {
    value: string
}

export interface BooleanField extends ComplexField {
    value: string
}

export interface ImageField extends ComplexField {
    content: string
}

interface ComplexField {
    type: FieldTypes
}

export enum FieldTypes {
    OptionSet = 'optionset',
    EntityReference = 'entity-reference',
    Date = 'date',
    Integer = 'integer',
    Boolean = 'boolean',
    Image = 'image',
}
