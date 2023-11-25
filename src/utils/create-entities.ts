import { CompanyEntity } from 'src/modules/company/entities/company.entity';
import { Company } from 'src/modules/company/entities/company.model';
import { LocationEntity } from 'src/modules/location/entities/location.entity';
import { Location } from 'src/modules/location/entities/location.model';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { User } from 'src/modules/user/entities/user.model';

export function createLocations(locations: Location[]): LocationEntity[] {
  const newLocations = locations.map(({ ...props }) => {
    return new LocationEntity({ ...props, companyId: props.company.id });
  });

  return newLocations;
}

export function createCompanies(companies: Company[]): CompanyEntity[] {
  const newCompanies = companies.map(({ user, locations, ...props }) => {
    const newLocations = createLocations(locations);
    return new CompanyEntity({
      ...props,
      userId: user.id,
      locations: newLocations,
    });
  });

  return newCompanies;
}

export function createUsers(users: User[]): Omit<UserEntity, 'password'>[] {
  const newUsers = users.map(({ companies, ...props }) => {
    const newCompanies = createCompanies(companies);
    const newUser = new UserEntity({
      ...props,
      companies: newCompanies,
    });
    delete newUser.password;
    return newUser;
  });

  return newUsers;
}
