# TODO: refactor out to lib as soon as there are multiple extensions
import requests
import logging
from flask import request


AUTH_HEADER_NAME = 'X-Auth-Token'
USER_AUTH_HEADER_NAME = 'X-User-Auth-Token'

logger = logging.getLogger(__name__)

# Base class, extend with
class AuthClient:

    def init_app(self, app, restrict_access=False):
        self._restrict_access = restrict_access
        self._headers = {
            AUTH_HEADER_NAME: app.config['XDR_AUTH_TOKEN'],
            'Content-Type': 'application/json'
        }
        self._auth_uri = app.config['XDR_URL']

        # TODO: if using auth is chosen solution, then use this instead of @require_api_key
        # if restrict_access:
        #     app.before_request(self.check_access_before_request)

    def _get(self, path, extra_headers=None, user_from_request=False):
        headers = {}
        headers.update(self._headers)
        if extra_headers:
            headers.update(extra_headers)
        if user_from_request:
            headers.update({USER_AUTH_HEADER_NAME: request.headers.get(USER_AUTH_HEADER_NAME)})
        uri = f"{self._auth_uri}{path}"
        return requests.get(url=uri, headers=headers)

    def has_access(self):
        # logger.info(f"JACEK_DEBUG: {self._headers[AUTH_HEADER_NAME]} | {request.headers.get(USER_AUTH_HEADER_NAME)}")
        if not self._restrict_access:
            return True
        path = '/auth/user/has_extension_permission'
        response = self._get(path=path, user_from_request=True)
        return True if response.status_code == 200 else False

    def check_access_before_request(self):
        if not self.has_access():
            return 'Unauthorised', 401

