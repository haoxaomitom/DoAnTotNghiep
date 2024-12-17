angular.module('myApp', [])
            .controller('ReportController', function ($http) {
                const vm = this;
                const baseUrl = 'http://localhost:8080/api/admin/reports';
                const token = localStorage.getItem("token");

                vm.reports = [];
                vm.filteredReports = [];
                vm.searchQuery = '';
                vm.sortBy = 'createdAt';
                vm.currentPage = 1;
                vm.itemsPerPage = 5;
                vm.totalPages = 1;
                vm.rejectingReport = null;
                vm.rejectedReason = "";
                vm.selectedReport = null; // Để lưu thông tin báo cáo được chọn

                vm.loadReports = function () {
                    $http.get(`${baseUrl}/all`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }).then(function (response) {
                        vm.reports = response.data;
                        vm.totalPages = Math.ceil(vm.reports.length / vm.itemsPerPage);
                        vm.updateFilteredReports();
                    }).catch(function (error) {
                        console.error("Lỗi khi tải báo cáo:", error);
                        alert("Không thể tải báo cáo.");
                    });
                };

                vm.updateFilteredReports = function () {
                    let filtered = vm.reports;

                    // Tìm kiếm báo cáo
                    if (vm.searchQuery) {
                        filtered = filtered.filter(report =>
                            report.reportContent.toLowerCase().includes(vm.searchQuery.toLowerCase()));
                    }

                    // Sắp xếp báo cáo
                    filtered.sort((a, b) => {
                        if (vm.sortBy === 'createdAt') {
                            return new Date(b.createdAt) - new Date(a.createdAt);
                        }
                        return a.status.localeCompare(b.status);
                    });

                    // Phân trang
                    const start = (vm.currentPage - 1) * vm.itemsPerPage;
                    const end = start + vm.itemsPerPage;
                    vm.filteredReports = filtered.slice(start, end);
                };

                vm.sortReports = function () {
                    vm.updateFilteredReports();
                };

                vm.changePage = function (page) {
                    if (page < 1 || page > vm.totalPages) return;
                    vm.currentPage = page;
                    vm.updateFilteredReports();
                };

                vm.approveReport = function (reportId) {
                    $http.put(`${baseUrl}/${reportId}/status?status=Đã duyệt`, null, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }).then(function () {
                        const report = vm.reports.find(r => r.reportId === reportId);
                        if (report) report.status = 'Đã duyệt';
                        vm.updateFilteredReports();
                        alert("Báo cáo đã được duyệt.");
                    }).catch(function (error) {
                        console.error("Lỗi khi duyệt báo cáo:", error);
                        alert("Không thể duyệt báo cáo.");
                    });
                };

                vm.openRejectModal = function (report) {
                    vm.rejectingReport = report;
                    vm.rejectedReason = "";
                    $('#rejectModal').modal('show');
                };

                vm.viewReportDetails = function (report) {
                    vm.selectedReport = report;
                    $('#detailsModal').modal('show'); // Mở modal xem chi tiết
                };

                vm.confirmReject = function () {
                    if (!vm.rejectedReason.trim()) {
                        alert("Vui lòng nhập lý do từ chối.");
                        return;
                    }
                    const reportId = vm.rejectingReport.reportId;
                    $http.put(`${baseUrl}/${reportId}/status?status=Bị từ chối&reason=${encodeURIComponent(vm.rejectedReason)}`, null, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }).then(function () {
                        const report = vm.reports.find(r => r.reportId === reportId);
                        if (report) {
                            report.status = 'Bị từ chối';
                            report.rejectedReason = vm.rejectedReason;
                        }
                        vm.updateFilteredReports();
                        alert("Báo cáo đã bị từ chối.");
                        $('#rejectModal').modal('hide');
                    }).catch(function (error) {
                        console.error("Lỗi khi từ chối báo cáo:", error);
                        alert("Không thể từ chối báo cáo.");
                    });
                };

                // Initial data load
                vm.loadReports();
            });