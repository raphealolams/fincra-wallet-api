/* eslint-disable @typescript-eslint/ban-types */
import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { getRepository } from 'typeorm';

import { DatabaseTableNames } from 'src/enums/table-names.enum';
import { User } from 'src/users/entities/users.entity';

type modelEntity = typeof User;

@Injectable()
@ValidatorConstraint({ async: true })
class IsRowAlreadyExistConstraint implements ValidatorConstraintInterface {
  repositories: Map<DatabaseTableNames, modelEntity>;

  constructor() {
    // Initialize all the repositories we would like to make available to the validator
    if (!this.repositories) {
      this.repositories = new Map<DatabaseTableNames, modelEntity>();

      this.repositories.set(DatabaseTableNames.USERS, User);
    }
  }

  /**
   * Returns a single Typeorm repository
   */
  public findRepo(repoName: DatabaseTableNames) {
    const entity = this.repositories.get(repoName);
    if (!entity) {
      throw new ReferenceError('Repository not found in factory');
    }

    const repo = getRepository(entity);
    if (!repo) {
      throw new ReferenceError(`Could not get repository for ${repoName}`);
    }

    return repo;
  }

  /**
   * This performs a check to determine if the value already exists on the database table.
   *
   * @param value
   * @param args
   */
  async validate(value: any, args: ValidationArguments) {
    const entityName: DatabaseTableNames = args.constraints[0];
    const column: string = args.constraints[1];

    const repo = this.findRepo(entityName);
    const row = await repo.findOne({
      [column]: value,
    });

    if (row) return false;

    return true;
  }
}

/**
 * The field under validation must exist in the given database table
 *
 * @param repositoryName The name of the database table
 * @param columnName Custom column name to check
 * @param validationOptions
 */
export function IsRowAlreadyExist(
  repositoryName: string,
  columnName: string,
  validationOptions?: ValidationOptions,
) {
  return (object: Object, propertyName: string): void => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [repositoryName, columnName],
      validator: IsRowAlreadyExistConstraint,
    });
  };
}
