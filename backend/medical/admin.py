from django.contrib import admin

from .models import Appointment, ChildProfile, Hospital, Reminder, VaccinationRecord, VaccineCatalog


@admin.register(Hospital)
class HospitalAdmin(admin.ModelAdmin):
    list_display = ["name", "code", "city", "is_active"]
    list_filter = ["is_active", "city"]
    search_fields = ["name", "code"]


@admin.register(ChildProfile)
class ChildProfileAdmin(admin.ModelAdmin):
    list_display = ["first_name", "last_name", "parent", "birth_date", "gender", "assigned_doctor"]
    list_filter = ["gender"]
    search_fields = ["first_name", "last_name", "parent__email"]
    raw_id_fields = ["parent", "assigned_doctor", "hospital"]


@admin.register(VaccineCatalog)
class VaccineCatalogAdmin(admin.ModelAdmin):
    list_display = ["name", "code", "doses_required", "recommended_age", "is_active"]
    list_filter = ["is_active"]
    search_fields = ["name", "code"]


@admin.register(VaccinationRecord)
class VaccinationRecordAdmin(admin.ModelAdmin):
    list_display = ["child", "vaccine", "status", "scheduled_date", "administered_at", "doctor"]
    list_filter = ["status"]
    search_fields = ["child__first_name", "child__last_name", "vaccine__name"]
    raw_id_fields = ["child", "vaccine", "doctor", "hospital"]


@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ["child", "hospital", "appointment_date", "status", "doctor"]
    list_filter = ["status"]
    raw_id_fields = ["child", "hospital", "doctor"]


@admin.register(Reminder)
class ReminderAdmin(admin.ModelAdmin):
    list_display = ["child", "send_at", "channel", "sent"]
    list_filter = ["sent", "channel"]
    raw_id_fields = ["child", "vaccination_record"]
