using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using DasGlobal.Models;
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
    }
}