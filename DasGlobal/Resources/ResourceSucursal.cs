using System.Collections.Generic;
using System.Linq;
using DasGlobal.Models;

namespace DasGlobal.Resources
{
    public static class ResourceSucursal
    {
        public static object ToResource(this IQueryable<Sucursal>  model) => model.ToList().ToResource();
        public static object ToResource(this IEnumerable<Sucursal> model) => model.Select(x => x.ToResource());

        public static object ToResource(this Sucursal model) => new
                                                                {
                                                                    model.Id,
                                                                    model.Nombre,
                                                                    model.Direccion,
                                                                    model.Telefono,
                                                                    model.EmpresaId,
                                                                    model.FechaRegistro,
                                                                    Empresa = model.Empresa?.ToResource()
                                                                };
    }
}