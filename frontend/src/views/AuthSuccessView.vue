<script setup lang="ts">
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth.store";
import { onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const authStore = useAuthStore();

onMounted(async () => {
  try {
    await authService.getProfile();
    authStore.setIsAuthenticated(true);
    router.push("/");
  } catch (error) {
    console.error("Failed to fetch profile:", error);
  }
});
</script>
