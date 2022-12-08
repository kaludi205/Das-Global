using System;
using System.Data.Entity;
using System.Web.Mvc;
using DasGlobal.Models;
using DasGlobal.Resources;

namespace DasGlobal.Controllers
{
    public class ColaboradoresController : BaseController
    {
        [HttpGet]
        public ActionResult Index()
        {
            ViewBag.Data = new
                           {
                               model      = UoW.RepoColaborador.All().ToResource(),
                               sucursales = UoW.RepoSucursal.All().ToResource(),
                               empresas = UoW.RepoEmpresa.All()
                                             .Include(x => x.Pais)
                                             .ToResource()
                           };
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "Nombre,Cui,SucursalId")] Colaboradore model)
        {
            return UoW.RepoColaborador.CuiVerify(model)
                       ? UnprocessableEntity("El Cui del colaborador ya existe en la sucursal seleccionada")
                       : SuccessResponse(UoW.RepoColaborador.Create(model).ToResource());
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "Id,Nombre,Cui,SucursalId")] Colaboradore model)
        {
            return UoW.RepoColaborador.CuiVerify(model)
                       ? UnprocessableEntity("El Cui del colaborador ya existe en la sucursal seleccionada")
                       : SuccessResponse(UoW.RepoColaborador.Edit(model).ToResource());
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Delete(int id)
        {
            try
            {
                return SuccessResponse(UoW.RepoColaborador.Delete(id));
            }
            catch (Exception)
            {
                return Conflict();
            }
        }
    }
}