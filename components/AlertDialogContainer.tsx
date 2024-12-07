import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface AlertDialogContainerProps {
  triggerElement?: React.ReactElement;
  title: string;
  desc: string;
  cName: string;
  actionCancel?: string;
  actionSubmit?: string;
  onAction?: () => void; // Hàm thực thi hành động (tuỳ chọn)
}

export function AlertDialogContainer({
  triggerElement,
  title,
  desc,
  cName,
  actionCancel = "Cancel",
  actionSubmit = "Continue",
  onAction,
}: AlertDialogContainerProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{triggerElement}</AlertDialogTrigger>
      <AlertDialogContent className={cName}>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{desc}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{actionCancel}</AlertDialogCancel>
          <AlertDialogAction onClick={onAction}>
            {actionSubmit}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
