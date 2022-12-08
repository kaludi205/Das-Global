using System.Collections.Generic;
using System.Linq;
using DasGlobal.Models;

namespace DasGlobal.Resources
{
    public static class ResourceSucursal
    {
        public static object ToResource(this IQueryable<Sucursale>  model) => model.ToList().ToResource();
        public static object ToResource(this IEnumerable<Sucursale> model) => model.Select(x => x.ToResource());

        public static object ToResource(this Sucursale model) => new
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