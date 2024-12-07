"use client";

interface FormDeleteProps {
  triggerElement: React.ReactElement;
  removeEmployee: (id: number) => Promise<{ success: boolean }>;
}

export default function FormDelete({
  triggerElement,
  removeEmployee,
}: FormDeleteProps) {
  const handleDelete = async () => {
    try {
      const result = await removeEmployee(1); // Example: ID 1
      if (result.success) console.log("Employee deleted successfully");
    } catch (error) {
      console.error("Failed to delete employee:", error);
    }
  };

  return (
    <form>
      <div onClick={handleDelete}>{triggerElement}</div>
    </form>
  );
}
