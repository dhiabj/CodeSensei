<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useToast } from "vue-toastification";

const router = useRouter();
const route = useRoute();
const toast = useToast();

onMounted(() => {
  const error = route.query.error as string;

  if (error) {
    toast.error(error);
    router.push("/login");
  } else {
    toast.error("Invalid OAuth response");
    router.push("/login");
  }
});
</script>
