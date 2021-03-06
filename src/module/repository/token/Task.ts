import { DBModuleInIt } from "../../../lib/decorators/DBModul";
import DBStory          from "./../../../lib/abstract/DBStory";

import Model                                                                          from "./Model";
import { CreateOptions, FindOptions, Includeable, NonNullFindOptions, UpdateOptions } from "sequelize/types/lib/model";
import ClientModel                                                                    from "./../client/Model";
import { Transaction, UpsertOptions }                                                 from "sequelize";

/**
 * @name Task
 */
@DBModuleInIt
export default class Task extends DBStory {
    /**
     * @name _instance
     * @private
     */
    private static _instance: Task;

    /**
     * @name Task
     */
    constructor() {
        super();
        this._model = Model;
        this._options = {
            timestamps: true,
            createdAt: "created_dtm",
            updatedAt: false,
        } as any;

        this._attributes = this._model.fieldSet;
    }

    /**
     * @name Instance
     * @constructor
     */
    static Instance(): Task {
        if (!Task._instance) {
            Task._instance = new Task();
        }

        return Task._instance;
    }

    /**
     * @name getOne
     * @param options
     */
    public getOne(options: NonNullFindOptions<Model["_attributes"]>): Promise<Model> {
        return Model.findOne({
            ...options,
            raw: false,
            nest: false,
            mapToModel: false,
        });
    }

    /**
     * @name getList
     * @param options
     */
    public getList<M extends Model>(options?: FindOptions<M["_attributes"]>): Promise<Model[]> {
        return Model.findAll({
            ...options,
            raw: false,
            nest: false,
            mapToModel: false,
        } as any);
    }

    /**
     * @name updateOne
     * @param values
     * @param options
     */
    public updateOne(values: Partial<Model["_attributes"]>, options: UpdateOptions<Model["_attributes"]>): Promise<[number, Model[]]> {
        return Model.update(values, options);
    }

    /**
     * @name upsertOne
     * @param values
     * @param options
     */
    public upsertOne(values: Model["_creationAttributes"], options: UpsertOptions<Model["_attributes"]>): Promise<[Model, boolean]> {
        return Model.upsert(values, options);
    }

    /**
     * @name createOne
     * @param values
     * @param options
     */
    public async createOne(values: Model["_creationAttributes"], options?: CreateOptions<Model["_attributes"]>): Promise<Model | Transaction | any> {
        return await Model.create(values, options);
    }

    /**
     * @name transaction
     */
    public async transaction(): Promise<Transaction> {
        return await Model.sequelize.transaction({benchmark: true});
    }

    /**
     * @name client
     * @param conditions
     */
    public client(conditions?: NonNullFindOptions<Model["_attributes"]>["where"]): Includeable {
        return {
            model: ClientModel as any,
            required: true,
            where: conditions,
            as: "client",
        };
    }

    /**
     * @name assocs
     * @protected
     */
    protected assocs() {
        Model.belongsTo(ClientModel, {
            as: "client",
            foreignKey: "ClientId",
            targetKey: "ClientId",
        });
    }
}
