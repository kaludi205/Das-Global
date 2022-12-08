using System;
using System.Data.Entity;
using System.Web.Mvc;
using DasGlobal.Models;
using DasGlobal.Resources;

namespace DasGlobal.Controllers
{
    public class EmpleadosController : BaseController
    {
        [HttpGet]
        public ActionResult Index()
        {
            ViewBag.Requerimientos = new
                                     {
                                         model = UoW.RepoSucursal.All().ToResource(),
                                         sucursales = UoW.RepoSucursal.All()
                                                         .Include(x => x.Empresa)
                                                         .Include(x => x.Empresa.Pais)
                                                         .ToResource()
                                     };
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "Nombre,EmpresaId,Direccion,Telefono")] Sucursal model)
        {
            return SuccessResponse(UoW.RepoSucursal.Create(model).ToResource());
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "Id,Nombre,Direccion,Telefono")] Sucursal model)
        {
            return SuccessResponse(UoW.RepoSucursal.Edit(model).ToResource());
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Delete(int id)
        {
            try
            {
                return SuccessResponse(UoW.RepoSucursal.Delete(id));
            }
            catch (Exception)
            {
                return Conflict();
            }
        }
    }
}