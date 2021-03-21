const dotenv = require('dotenv-flow');
const path = require('path');
const { ContainerBuilder, PackageReference, YamlFileLoader, Definition, Parameter } = require('node-dependency-injection');

const ROOT_DIR = path.join(__dirname, '..');

// load dotenv
dotenv.config({
    default_node_env: 'local',
    path: ROOT_DIR
});

// start container
let container = new ContainerBuilder(true, path.join(ROOT_DIR, 'src'));

let loader = new YamlFileLoader(container);
loader.load(path.join(__dirname, 'services.yml'));

exports.container = container;