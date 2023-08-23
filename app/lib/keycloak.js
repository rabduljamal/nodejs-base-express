
var Keycloak = require('keycloak-connect');

let _keycloak;

var keycloakConfig = {
    clientId: process.env.KEYCLOAK_ID,
    bearerOnly: true,
    serverUrl: process.env.KEYCLOAK_SERVER,
    realm: process.env.KEYCLOAK_REALM,
    realmPublicKey: process.env.KEYCLOAK_REALMKEY
};

function initKeycloak(memoryStore) {
    if (_keycloak) {
        console.warn("Trying to init Keycloak again!");
        return _keycloak;
    } 
    else {
        try {
            console.log("Initializing Keycloak...");
            Keycloak.prototype.accessDenied = (req,res) => {
                Responser.error(res, 'User Unauthorized.')
            };

            _keycloak = new Keycloak({ store: memoryStore }, keycloakConfig);
            
            console.log("Keycloak Connected.");
            return _keycloak;
        } catch (error) {
            console.log(error);
            return error;
        }
    }
}

function getKeycloak() {
    if (!_keycloak){
        console.error('Keycloak has not been initialized. Please called init first.');
    } 
    return _keycloak;
}

module.exports = {
    initKeycloak,
    getKeycloak
};