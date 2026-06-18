from io import BytesIO

from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill

from app.services.reports_service import ReportsService


class ReportsExportService:

    @staticmethod
    def create_asset_status_excel():

        report = ReportsService.get_asset_status_report()

        workbook = Workbook()
        sheet = workbook.active
        sheet.title = "Asset Status Report"

        headers = [
            "Status",
            "Count"
        ]

        sheet.append(headers)

        for cell in sheet[1]:
            cell.font = Font(bold=True)
            cell.fill = PatternFill(
                start_color="D9EAF7",
                end_color="D9EAF7",
                fill_type="solid"
            )

        for row in report:
            sheet.append([
                row["status"],
                row["count"]
            ])

        sheet.column_dimensions["A"].width = 25
        sheet.column_dimensions["B"].width = 15

        output = BytesIO()
        workbook.save(output)
        output.seek(0)

        return output