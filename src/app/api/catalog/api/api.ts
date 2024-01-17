export * from './common.service';
import { CommonService } from './common.service';
export * from './common.serviceInterface';
export * from './default.service';
import { DefaultService } from './default.service';
export * from './default.serviceInterface';
export * from './health.service';
import { HealthService } from './health.service';
export * from './health.serviceInterface';
export * from './movies.service';
import { MoviesService } from './movies.service';
export * from './movies.serviceInterface';
export * from './shows.service';
import { ShowsService } from './shows.service';
export * from './shows.serviceInterface';
export const APIS = [CommonService, DefaultService, HealthService, MoviesService, ShowsService];
