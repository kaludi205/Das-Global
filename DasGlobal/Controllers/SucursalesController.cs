using System;
using System.Data.Entity;
using System.Web.Mvc;
using DasGlobal.Models;
using DasGlobal.Resources;

namespace DasGlobal.Controllers
{
    public class SucursalesController : BaseController
    {
        [HttpGet]
        public ActionResult Index()
        {
            ViewBag.Data = new
                           {
                               model = UoW.RepoSucursal.All().ToResource(),
                               empresas = UoW.RepoEmpresa.All()
                                             .Include(x => x.Pais)
                                             .ToResource()
                           };
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "Nombre,EmpresaId,Direccion,Telefono")] Sucursale model)
        {
            return UoW.RepoSucursal.NombreVerify(model)
                       ? UnprocessableEntity("La sucursal ya existe en la empresa seleccionada")
                       : SuccessResponse(UoW.RepoSucursal.Create(model).ToResource());
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "Id,Nombre,Direccion,Telefono,EmpresaId")] Sucursale model)
        {
            return UoW.RepoSucursal.NombreVerify(model)
                       ? UnprocessableEntity("La sucursal ya existe en la empresa seleccionada")
                       : SuccessResponse(UoW.RepoSucursal.Edit(model).ToResource());
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