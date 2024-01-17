/**
 * CinePik Catalog API
 * The CinePik Catalog microservice.
 *
 * The version of the OpenAPI document: 0.3.2
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { SourceResponseDto } from './sourceResponseDto';


export interface ShowDetailResponseDto { 
    /**
     * Show identifier.
     */
    id: number;
    /**
     * Url for the backdrop image.
     */
    backdrop_path: string;
    /**
     * List of genres that best describe the content.
     */
    genres: Array<string>;
    /**
     * Title in the original language.
     */
    original_title: string;
    /**
     * Short content description.
     */
    overview: string;
    /**
     * Url for the poster image.
     */
    poster_path: string;
    /**
     * Show first aired date.
     */
    first_aired?: string;
    /**
     * Show title.
     */
    title: string;
    /**
     * Show vote average.
     */
    vote_average: number;
    /**
     * Show vote count.
     */
    vote_count: number;
    /**
     * Show Youtube trailer.
     */
    youtube_trailer: string;
    /**
     * Show sources.
     */
    sources: Array<SourceResponseDto>;
}

