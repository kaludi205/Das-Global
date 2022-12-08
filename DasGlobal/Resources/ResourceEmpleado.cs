using System.Collections.Generic;
using System.Linq;
using DasGlobal.Models;

namespace DasGlobal.Resources
{
    public static class ResourceColaboradore
    {
        public static object ToResource(this IQueryable<Colaboradore>  model) => model.ToList().ToResource();
        public static object ToResource(this IEnumerable<Colaboradore> model) => model.Select(x => x.ToResource());

        public static object ToResource(this Colaboradore model) => new
                                                                    {
                                                                        model.Id,
                                                                        model.Nombre,
                                                                        model.Cui,
                                                                        model.SucursalId,
                                                                        model.FechaRegistro,
                                                                        Sucursal = model.Sucursale?.ToResource()
                                                                    };
    }
}