import { faker } from "@faker-js/faker";
import { PlayerData } from "./player";
            
export function createPlayerData(partialData?: Partial<PlayerData>): PlayerData {
    return {
        firstName: partialData?.firstName || faker.person.firstName(),
        lastName: partialData?.lastName || faker.person.lastName(),
        tour: partialData?.tour || 'ATP',
        country: partialData?.country || faker.location.country(),
    }
}