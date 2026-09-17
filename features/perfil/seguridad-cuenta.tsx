import { Panel } from "@/components/ui/panel";
import { CambiarContrasena } from "./cambiar-contrasena";
import { EliminarCuenta } from "./eliminar-cuenta";

/** Panel de la cuenta: cambiar la contraseña y darse de baja. */
export function SeguridadCuenta({ email }: { email: string }) {
  return (
    <Panel titulo="Cuenta y seguridad" descripcion={`Iniciaste sesión como ${email}.`}>
      <div className="flex flex-col gap-5">
        <CambiarContrasena />
        <EliminarCuenta />
      </div>
    </Panel>
  );
}
