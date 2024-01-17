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


export interface MovieDetailResponseDto { 
    /**
     * Movie identifier.
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
     * Movie release date.
     */
    release_date?: string;
    /**
     * Movie title.
     */
    title: string;
    /**
     * Movie vote average.
     */
    vote_average: number;
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
}

