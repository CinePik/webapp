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


export interface SearchItemResponseDto { 
    /**
     * Content identifier.
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
     * Content release date.
     */
    release_date?: string;
    /**
     * Content title.
     */
    title: string;
    /**
     * Content type (movie or show).
     */
    contentType: string;
    /**
     * Movie vote count.
     */
    vote_count: number;
    /**
     * Movie Youtube trailer.
     */
    youtube_trailer: string;
    /**
     * Movie sources.
     */
    sources: Array<SourceResponseDto>;
    vote_average: number;
}

