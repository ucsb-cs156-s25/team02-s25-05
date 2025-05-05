import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import UCSBOrganizationForm from "main/components/UCSBOrganizations/UCSBOrganizationForm";
import { Navigate } from "react-router-dom";
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function UCSBOrganizationCreatePage({ storybook = false }) {
  /* ---------- axios helper ---------- */
  const objectToAxiosParams = (org) => ({
    url: "/api/ucsborganizations/post",
    method: "POST",
    params: {
      orgCode: org.orgCode,
      orgTranslationShort: org.orgTranslationShort,
      orgTranslation: org.orgTranslation,
      inactive: org.inactive,
    },
  });

  /* ---------- success handler ---------- */
  const onSuccess = (org) => {
    toast(
      `New organization created - orgCode: ${org.orgCode} short: ${org.orgTranslationShort}`,
    );
  };

  /* ---------- react‑query mutation ---------- */
  const mutation = useBackendMutation(
    objectToAxiosParams,
    { onSuccess },
    // Stryker disable next-line all
    ["/api/ucsborganizations/all"], // mark list stale
  );

  const { isSuccess } = mutation;

  const onSubmit = async (data) => {
    mutation.mutate(data);
  };

  if (isSuccess && !storybook) {
    return <Navigate to="/ucsborganizations" />;
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create New UCSB Organization</h1>
        <UCSBOrganizationForm submitAction={onSubmit} />
      </div>
    </BasicLayout>
  );
}
