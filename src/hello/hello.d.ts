import { ObjectId } from "mongodb";
        
export interface HelloData implements BaseEntity {
    message: string;
}