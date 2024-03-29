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
import { ShowEpisodeResponseDto } from './showEpisodeResponseDto';


export interface ShowSeasonsResponseDto { 
    /**
     * Season number.
     */
    season: number;
    /**
     * Season episodes.
     */
    episodes: Array<ShowEpisodeResponseDto>;
}

