# couchdb setup on ubuntu

- install via apt

- bind to 0.0.0.0 in /etc/couchdb/local.ini, restart

- install couch-per-user
  - install rebar via apt
  - create plugins directory at /usr/lib/couchdb/plugins
  - git clone into plugins dir, and `make`

- create users with PUT to http://<server>/_users/org.couchdb.user:testuser1 with standard JSON payload:
      {
        "_id": "org.couchdb.user:dbreader",
        "name": "testuser1",w
        "type": "user",
        "roles": [],
        "password": "password1"
      }

- enable cors

        HOST=http://username:password@<server>

        curl -X PUT $HOST/_config/httpd/enable_cors -d '"true"'
        curl -X PUT $HOST/_config/cors/origins -d '"*"'
        curl -X PUT $HOST/_config/cors/credentials -d '"true"'
        curl -X PUT $HOST/_config/cors/methods -d '"GET, PUT, POST, HEAD, DELETE"'
        curl -X PUT $HOST/_config/cors/headers -d '"accept, authorization, content-type, origin, referer"'
