export * from './default.service';
import { DefaultService } from './default.service';
export * from './default.serviceInterface';
export * from './recommendations.service';
import { RecommendationsService } from './recommendations.service';
export * from './recommendations.serviceInterface';
export const APIS = [DefaultService, RecommendationsService];
