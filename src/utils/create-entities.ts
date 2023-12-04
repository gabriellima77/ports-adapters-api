import { CompanyEntity } from '../modules/company/entities/company.entity';
import { Company } from '../modules/company/entities/company.model';
import { LocationEntity } from '../modules/location/entities/location.entity';
import { Location } from '../modules/location/entities/location.model';
import { UserEntity } from '../modules/user/entities/user.entity';
import { User } from '../modules/user/entities/user.model';

export function createLocations(
  locations: Location[],
  companyId?: number,
): LocationEntity[] {
  const newLocations = locations.map(({ company, ...props }) => {
    return new LocationEntity({
      ...props,
      companyId: companyId ?? company.id,
    });
  });

  return newLocations;
}

export function createCompanies(
  companies: Company[],
  userId?: number,
): CompanyEntity[] {
  const newCompanies = companies.map(({ locations, user, ...props }) => {
    const newLocations = createLocations(locations, props.id);
    return new CompanyEntity({
      ...props,
      userId: userId ?? user.id,
      locations: newLocations,
    });
  });

  return newCompanies;
}

export function createUsers(users: User[]): Omit<UserEntity, 'password'>[] {
  const newUsers = users.map(({ companies, ...props }) => {
    const newCompanies = createCompanies(companies, props.id);
    const newUser = new UserEntity({
      ...props,
      companies: newCompanies,
    });
    delete newUser.password;
    return newUser;
  });

  return newUsers;
}
