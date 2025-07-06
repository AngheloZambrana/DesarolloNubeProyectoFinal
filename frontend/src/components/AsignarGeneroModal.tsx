import { useEffect, useState } from "react";
import { generoService, type Genero } from "../services/generoService";
import { singerService } from "../services/singerService";
import "./styles/AsignarGeneroModal.css"

interface AsignarGeneroModalProps {
  singerId: string;
  onClose: () => void;
}

export function AsignarGeneroModal({ singerId, onClose }: AsignarGeneroModalProps) {
  const [generos, setGeneros] = useState<Genero[]>([]);
  const [seleccionados, setSeleccionados] = useState<Set<string>>(new Set());
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    const cargar = async () => {
      try {
        const [todosLosGeneros, singerDoc] = await Promise.all([
          generoService.obtenerGeneros(),
          singerService.obtenerSingerPorId(singerId)
        ]);

        const generosYaAsignados: string[] = singerDoc?.generos || [];

        const generosDisponibles = todosLosGeneros.filter(
          (g) => !generosYaAsignados.includes(g.id)
        );

        setGeneros(generosDisponibles);
      } catch (err) {
        console.error("Error cargando géneros:", err);
      }
    };

    cargar();
  }, [singerId]);

  const handleCheckboxChange = (id: string) => {
    setSeleccionados((prev) => {
      const nuevo = new Set(prev);
      if (nuevo.has(id)) {
        nuevo.delete(id);
      } else {
        nuevo.add(id);
      }
      return nuevo;
    });
  };

  const handleGuardar = async () => {
    setCargando(true);
    try {
      for (const id of seleccionados) {
        await singerService.agregarGeneroASinger(singerId, id);
      }
      alert("Géneros asignados con éxito");
      onClose();
    } catch (err) {
      console.error("Error asignando géneros:", err);
      alert("Error al asignar géneros");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="asignar-genero-overlay">
        <div className="asignar-genero-modal">
            <h2>Selecciona tus géneros</h2>

            {generos.length === 0 ? (
                <p>No hay más géneros disponibles para asignar.</p>
            ) : (
                <>
                {generos.map((g) => (
                    <label key={g.id}>
                    <input
                        type="checkbox"
                        checked={seleccionados.has(g.id)}
                        onChange={() => handleCheckboxChange(g.id)}
                    />
                    {g.name}
                    </label>
                ))}
                <br />
                <button onClick={handleGuardar} disabled={cargando}>
                    {cargando ? "Guardando..." : "Guardar selección"}
                </button>
                </>
            )}

            <button onClick={onClose}>Cancelar</button>
            </div>

    </div>
  );
}
