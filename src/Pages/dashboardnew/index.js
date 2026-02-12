
import MainDashboard from "../../components/dashboardnew/MainContent";
import Sidebar from "../../components/dashboardnew/Sidebar";
import "../../components/Insurance/tailwind.css";

export default function DashboardPage() {
  return (
    <>
      <div className="tw-flex tw-w-full tw-h-screen tw-bg-gray-100 tw-overflow-hidden">

        <aside className="tw-w-1/5 tw-h-full tw-bg-white tw-border-r tw-border-gray-200 tw-p-6">
          <Sidebar />
        </aside>

        <main className="tw-w-4/5 tw-h-full tw-overflow-y-auto tw-p-8">
                <MainDashboard/>
        </main>

      </div>


    </>
  );
}

