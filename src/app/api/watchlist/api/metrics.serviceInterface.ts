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
import { HttpHeaders }                                       from '@angular/common/http';

import { Observable }                                        from 'rxjs';



import { Configuration }                                     from '../configuration';



export interface MetricsServiceInterface {
    defaultHeaders: HttpHeaders;
    configuration: Configuration;

    /**
     * Returns the Prometheus metrics
     * Returns the Prometheus metrics.
     */
    metricsControllerGetMetrics(extraHttpRequestParams?: any): Observable<string>;

}
