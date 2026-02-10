import VehicleManagement from '../../components/VehicleManagement';

const VehicleManagementPage = () =>{
return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8 max-w-7xl mx-auto bg-slate-50 min-h-screen">
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Vehicle Management</h1>
            <p className="text-gray-600">Add and manage your personal vehicles.</p>
        </div>
        <VehicleManagement/>
    </div>
);

}
export default VehicleManagementPage;
