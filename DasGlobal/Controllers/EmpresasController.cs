using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using DasGlobal.Extensions;
using DasGlobal.Models;
using DasGlobal.Models.UploadFile;
using DasGlobal.Resources;

namespace DasGlobal.Controllers
{
    public class EmpresasController : BaseController
    {
        [HttpGet]
        public ActionResult Index()
        {
            ViewBag.Data = new
                           {
                               model  = UoW.RepoEmpresa.All().ToResource(),
                               paises = UoW.RepoPais.All().ToResource()
                           };
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "Nombre,PaisId")] Empresa model)
        {
            return UoW.RepoEmpresa.NombreVerify(model)
                       ? UnprocessableEntity("La empresa ya existe en el país seleccionado")
                       : SuccessResponse(UoW.RepoEmpresa.Create(model).ToResource());
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "Id,Nombre,PaisId")] Empresa model)
        {
            return UoW.RepoEmpresa.NombreVerify(model)
                       ? UnprocessableEntity("La empresa ya existe en el país seleccionado")
                       : SuccessResponse(UoW.RepoEmpresa.Edit(model).ToResource());
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Delete(int id)
        {
            try
            {
                return SuccessResponse(UoW.RepoEmpresa.Delete(id));
            }
            catch (Exception)
            {
                return Conflict();
            }
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult UploadFile(HttpPostedFileBase file)
        {
            UploadFile result;

            if (file.ContentLength > 0)
            {
                try
                {
                    var str = (new StreamReader(file.InputStream)).ReadToEnd();

                    var jss = new JavaScriptSerializer();
                    result = jss.Deserialize<UploadFile>(str);
                }
                catch (Exception e)
                {
                    return UnprocessableEntity("El formato del archivo es inválido");
                }
            }
            else
            {
                return UnprocessableEntity("El formato del archivo es inválido");
            }

            var cuiDuplicado = result.empresa.sucursales
                                     .Select(x => x.colaboradores.Select(y => new
                                                                              {
                                                                                  x.nombre,
                                                                                  y.CUI
                                                                              }))
                                     .ConcatArray()
                                     .GroupBy(x => new
                                                   {
                                                       x.nombre,
                                                       x.CUI
                                                   })
                                     .Select(x => new
                                                  {
                                                      x.Key.nombre,
                                                      x.Key.CUI,
                                                      Count = x.Count()
                                                  }).Where(x => x.Count > 1).ToList();

            if (cuiDuplicado.Any())
            {
                return UnprocessableEntity("Duplicados", cuiDuplicado.Select(x => $"Sucursal: {x.nombre} - Cui: {x.CUI}").ToList());
            }

            try
            {
                UoW.BeginTransaction();
                var model = UoW.RepoEmpresa.Create(result);
                UoW.Commit();

                return SuccessResponse(model.ToResource());
            }
            catch (Exception e)
            {
                UoW.Rollback();
                return InternalServerError(e);
            }
        }
    }
}