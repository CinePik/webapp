import { KeycloakService } from 'keycloak-angular';
import { ConfigInitService } from './config-init.service';
import { firstValueFrom, from, switchMap } from 'rxjs';

export function initializeKeycloak(
  keycloak: KeycloakService,
  configService: ConfigInitService
) {
  return () =>
    firstValueFrom(
      configService.getConfig().pipe(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        switchMap<any, any>(config => {
          return from(
            keycloak.init({
              config: {
                url: config['KEYCLOAK_URL'],
                realm: config['KEYCLOAK_REALM'],
                clientId: config['KEYCLOAK_CLIENT_ID'],
              },
              loadUserProfileAtStartUp: true,
              initOptions: {
                checkLoginIframe: false,
              },
            })
          );
        })
      )
    );
}
