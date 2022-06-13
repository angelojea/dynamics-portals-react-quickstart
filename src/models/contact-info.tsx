export interface ContactInfo {
    id: string,
    firstname: string,
    lastname: string,
    name: string,
    email: string,
    phone: string,
    roles: { name: string, id: string }[]
}