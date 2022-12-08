using System.Collections.Generic;
using System.Linq;
using DasGlobal.Models;

namespace DasGlobal.Resources
{
    public static class ResourceEmpresa
    {
        public static object ToResource(this IQueryable<Empresa>  model) => model.ToList().ToResource();
        public static object ToResource(this IEnumerable<Empresa> model) => model.Select(x => x.ToResource());

        public static object ToResource(this Empresa model) => new
                                                               {
                                                                   model.Id,
                                                                   model.Nombre,
                                                                   model.PaisId,
                                                                   model.FechaRegistro,
                                                                   Pais = model.Pais?.ToResource()
                                                               };
    }
}