using System.Collections.Generic;
using System.Linq;
using DasGlobal.Models;

namespace DasGlobal.Resources
{
    public static class ResourceEmpleado
    {
        public static object ToResource(this IQueryable<Empleado>  model) => model.ToList().ToResource();
        public static object ToResource(this IEnumerable<Empleado> model) => model.Select(x => x.ToResource());

        public static object ToResource(this Empleado model) => new
                                                                {
                                                                    model.Id,
                                                                    model.Nombre,
                                                                    model.Cui,
                                                                    model.SucursalId,
                                                                    model.FechaRegistro,
                                                                    Sucursal = model.Sucursal?.ToResource()
                                                                };
    }
}