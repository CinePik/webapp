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

import { AddShowWatchlistDto } from '../model/models';
import { CreateShowCommentDto } from '../model/models';
import { ShowCommentResponseDto } from '../model/models';
import { UpdateShowCommentDto } from '../model/models';


import { Configuration }                                     from '../configuration';



export interface ShowsServiceInterface {
    defaultHeaders: HttpHeaders;
    configuration: Configuration;

    /**
     * Add a watchlist to the watchlist
     * Adds a show to the watchlist.
     * @param addShowWatchlistDto 
     */
    showsControllerAddShowWatchlist(addShowWatchlistDto: AddShowWatchlistDto, extraHttpRequestParams?: any): Observable<{}>;

    /**
     * Create show comment
     * Creates a user show comment.
     * @param createShowCommentDto 
     */
    showsControllerCreate(createShowCommentDto: CreateShowCommentDto, extraHttpRequestParams?: any): Observable<Array<ShowCommentResponseDto>>;

    /**
     * Returns all show comments
     * Returns all shows comments for a specific show.
     * @param userId 
     * @param showId 
     * @param season 
     * @param episode 
     */
    showsControllerFindAll(userId: string, showId: string, season: string, episode: string, extraHttpRequestParams?: any): Observable<Array<ShowCommentResponseDto>>;

    /**
     * Returns all shows on the watchlist
     * Returns all shows on the user watchlist.
     * @param userId 
     */
    showsControllerGetMovieWatchlist(userId: string, extraHttpRequestParams?: any): Observable<{}>;

    /**
     * Returns all show recommendations
     * Returns all show recommendations based on user watchlist.
     * @param userId 
     */
    showsControllerGetShowRecommendations(userId: string, extraHttpRequestParams?: any): Observable<{}>;

    /**
     * Deletes a show comment
     * Deletes a specific show comment.
     * @param id 
     */
    showsControllerRemove(id: string, extraHttpRequestParams?: any): Observable<Array<ShowCommentResponseDto>>;

    /**
     * Deletes a show from the watchlist
     * Deletes a show from the user watchlist.
     * @param id 
     */
    showsControllerRemoveShowWatchlist(id: string, extraHttpRequestParams?: any): Observable<{}>;

    /**
     * Updates show comment
     * Updates a specific show comment.
     * @param id 
     * @param updateShowCommentDto 
     */
    showsControllerUpdate(id: string, updateShowCommentDto: UpdateShowCommentDto, extraHttpRequestParams?: any): Observable<Array<ShowCommentResponseDto>>;

}
