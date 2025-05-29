import ActivitiesClient from './ActivitiesClient';
import { fetchActivities } from './FetchActivities';

export default async function Page() {
  const activitiesData = await fetchActivities();

  const rawItems = activitiesData.Items?.['$values'] ?? [];
  const rowData = rawItems.map((item: any) => ({
    ActivityDate: item.ActivityDate ?? '',
    ActivityType: item.ActivityType ?? '',
    CityName: item.CityName ?? '',
    Notes: item.Notes ?? '',
    StaffInvolved: item.StaffInvolved ?? '',
    CityId: item.CityId,
    CitySort: item.CitySort ?? '',
    EnteredByStaffName: item.EnteredByStaffName ?? '',
  }));

  return (
    <div className="bg-white min-h-screen w-full">
      <ActivitiesClient rowData={rowData} />
    </div>
  );
}