using System.Collections.Generic;
using System.Linq;
using DasGlobal.Models;

namespace DasGlobal.Resources
{
    public static class ResourcePais
    {
        public static object ToResource(this IQueryable<Pais>  model) => model.ToList().ToResource();
        public static object ToResource(this IEnumerable<Pais> model) => model.Select(x => x.ToResource());

        public static object ToResource(this Pais model) => new
                                                            {
                                                                model.Id,
                                                                model.Nombre,
                                                                model.Codigo,
                                                                model.FechaRegistro
                                                            };
    }
}