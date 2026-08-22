export type OrgPerson = {
  name: string;
  role: string;
};

export type OrgChart = {
  sponsor: OrgPerson;
  lead: OrgPerson;
  interns: OrgPerson[];
};
