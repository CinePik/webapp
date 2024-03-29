/**
 * CinePik Watchlist API
 * The CinePik Watchlist microservice.
 *
 * The version of the OpenAPI document: 0.2.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { HealthControllerCheckLiveness200ResponseInfoValue } from './healthControllerCheckLiveness200ResponseInfoValue';


export interface HealthControllerCheckLiveness503Response { 
    status?: string;
    info?: { [key: string]: HealthControllerCheckLiveness200ResponseInfoValue; } | null;
    error?: { [key: string]: HealthControllerCheckLiveness200ResponseInfoValue; } | null;
    details?: { [key: string]: HealthControllerCheckLiveness200ResponseInfoValue; };
}

