import { BooleanField, DateField, Entity, EntityReferenceField, FieldTypes, ImageField, IntegerField } from "../models";

export const optionSetField = (value: number): IntegerField => {
    return { type: FieldTypes.OptionSet, value: value + '' }
};

export const entityReferenceField = (entity: Entity, id: string): EntityReferenceField => {
    return { type: FieldTypes.EntityReference, entity: entity, id: id }
};

export const dateField = (value: Date): DateField => {
    return { type: FieldTypes.Date, value: value.toJSON() }
};

export const integerField = (value: number): IntegerField => {
    return { type: FieldTypes.Integer, value: value + '' }
};

export const booleanField = (value: boolean): BooleanField => {
    return { type: FieldTypes.Boolean, value: value + '' }
};

export const imageField = (base64Content: string): ImageField => {
    return { type: FieldTypes.Integer, content: base64Content }
};
