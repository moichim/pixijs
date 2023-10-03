import { Assets, Resource, Texture } from "pixi.js";
import { SimpleFileDefinition } from "./SceneFactory";

type BundledFile = {
    bundle: string,
    role: string,
    key: string,
    filePath: string,
    data?: Object,
    texture?: Texture<Resource>
}

type BundleSet = Map<string,BundledFile>

type RoleSet = Map<string,BundledFile>

export class AssetsManager {

    protected readonly registry: {
        bundles: Map<string,BundleSet>,
        roles: Map<string,RoleSet>,
        keys: Map<string,BundledFile>
    } = {
        bundles: new Map,
        roles: new Map,
        keys: new Map
    }


    // Adding files


    /** Add a single file */
    public addFile(
        bundle: string,
        fileName: string,
        meta: Object|undefined = undefined
    ) {

        const key = this.formatFileKey( bundle, fileName );

        if ( ! this.fileIsRegistered( bundle, fileName ) ) {

                Assets.add( 
                    key,
                    this.formatFilePath( bundle, fileName ),
                    meta
                );
    
                return this.register( bundle, fileName, meta );

        }
        
        console.info( `File ${key} was already added.` );
        return this.getFile( bundle, fileName )!;

    }


    // Loading files


    /** Load all files of one bundle */
    public async loadEntireBundle( bundle: string ) {
        const keys: string[] = [];
        for (let role of this.registry.bundles.get( bundle )!.values() ) {
            keys.push( role.key );
        }
        return Assets.load( keys ).then( this.postLoad.bind(this) );
    }


    /** Load subset of roles from one bundle */
    public async loadFromBundle( bundle: string, roles: string|string[] ) {
        
        roles = Array.isArray( roles ) ? roles : [ roles ];

        const b = this.registry.bundles.get( bundle );

        if ( b ) {
            const result = roles.map( role => {
                return b.get( role )!.key
            } );

            return Assets.load( result ).then( this.postLoad.bind(this) );
        }

        return undefined;

    }

    /** After a set of files was loaded, update the buffer and return array of formatted values */
    public async postLoad( result: Record<string,any> ) {

        return Object.fromEntries( 
            Object.entries( result ) 
                .map( ([key,entry]:[string,any]) => {

                    const record = this.registry.keys.get( key )!;
                    if ( record.texture === undefined )
                        record.texture = result[ key ];
                    return [key, record ];

                } )
        );

    };


    // Formatting files



    /** Generate the path for the given png file */
    protected formatFilePath(
        bundle: string,
        fileName: string
    ) {
        return `assets/bundles/${bundle}/${fileName}.png`
    }

    /** Generate a key for the given file */
    protected formatFileKey(
        bundle: string,
        fileName: string
    ){
        return `${bundle}__${fileName}`;
    }


    // Buffer registration


    /** Create a single registry entry */
    protected createRegistryRecord(
        bundle: string,
        role: string,
        meta: Object|undefined = undefined
    ) {
        return {
            bundle: bundle,
            role: role,
            key: this.formatFileKey( bundle, role ),
            filePath: this.formatFilePath( bundle, role ),
            data: meta,
            texture: undefined
        } as BundledFile
    }

    /** Add a file to the registry */
    protected register( bundle: string, role: string, meta: Object|undefined = undefined ) {

        const record = this.createRegistryRecord( bundle, role, meta );

        if ( ! this.registry.bundles.has( bundle ) )
            this.registry.bundles.set( bundle, new Map );
        this.registry.bundles.get(bundle)!.set( role, record );

        if ( !this.registry.roles.has( role ) )
            this.registry.roles.set( role, new Map );
        this.registry.roles.get(role)!.set( bundle, record );

        this.registry.keys.set( record.key, record );

        return record;
    }

    protected fileIsRegistered( bundle:string, role: string ) {
        return Array.from( this.registry.keys.keys()).includes( this.formatFileKey( bundle, role ) );
    }


    // Getters


    /** Get a file by its bundle and role */
    public getFile( bundle: string, role: string ) {

        if ( this.fileIsRegistered( bundle, role ) ) {

            const record = this.registry.bundles.get( bundle )!.get( role )!;

            return {
                ...record,
                texture: Assets.get( record.key )
            } as BundledFile

        }

        return undefined;

    }

    /** Get a single file by its key */
    public getByKey( key: string ) {
        return this.registry.keys.get( key );
    }

    /** Get all files of a bundle */
    public getBundleFiles( bundle: string ) {
        return this.registry.bundles.get( bundle );
    }

    public request() {
        return new AssetRequest( this );
    }

}

class AssetRequest {

    files: BundledFile[] = [];

    constructor( 
        public readonly manager: AssetsManager
    ) {

    }

    addFiles( ...files:SimpleFileDefinition[] ) {
        files.forEach( file => {
            this.files.push( this.manager.addFile( file.bundle, file.role ) );
        } );
        return this;
    }

    async load() {
        return Assets.load([...this.files.map(file=>file.key)]).then( result => this.manager.postLoad( result ) )
    }

}