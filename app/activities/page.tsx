import ActivitiesClient from './ActivitiesClient';
import { fetchActivities } from './fetchActivities';

export default async function Page() {
  const activitiesData = await fetchActivities();

  const rawItems = activitiesData.Items?.['$values'] ?? [];
  

  const rowData = rawItems
    .map((item: any) => ({
      ActivityDate: item.ActivityDate ?? '',
      ActivityType: item.ActivityType ?? '',
      CityName: item.CityName ?? '',
      Notes: item.Notes ?? '',
      StaffInvolved: item.StaffInvolved ?? '',
      CityId: item.CityId,
      CitySort: item.CitySort ?? '',
      EnteredByStaffName: item.EnteredByStaffName ?? '',
    }))
    .sort(
      (a: { ActivityDate: string }, b: { ActivityDate: string }) =>
        new Date(b.ActivityDate).getTime() - new Date(a.ActivityDate).getTime()
    );
    // After rowData is created
    //const uniqueActivityTypes = Array.from(
      //new Set(rowData.map(item => item.ActivityType).filter(Boolean))
    //);

    // uniqueActivityTypes is now an array of all unique, non-empty activity types
    //console.log(uniqueActivityTypes);

  return (
    <div className="bg-white min-h-screen w-full">
      <ActivitiesClient rowData={rowData} />
    </div>
  );
}
