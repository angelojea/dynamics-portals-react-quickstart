import { EntityReferenceField } from ".";

export interface Note {
    subject: string,
    notetext: string,
    objectid: EntityReferenceField,
    objecttypecode: string,
}
