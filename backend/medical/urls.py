from rest_framework.routers import DefaultRouter

from .views import (
    AppointmentViewSet,
    ChildProfileViewSet,
    HospitalViewSet,
    ReminderViewSet,
    VaccinationRecordViewSet,
    VaccineCatalogViewSet,
)

router = DefaultRouter()
router.register("hospitals", HospitalViewSet, basename="hospital")
router.register("children", ChildProfileViewSet, basename="child")
router.register("vaccines", VaccineCatalogViewSet, basename="vaccine")
router.register("vaccinations", VaccinationRecordViewSet, basename="vaccination")
router.register("appointments", AppointmentViewSet, basename="appointment")
router.register("reminders", ReminderViewSet, basename="reminder")

urlpatterns = router.urls
