using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using DasGlobal.Models;
using DasGlobal.Resources;

namespace DasGlobal.Controllers
{
    public class PaisesController : BaseController
    {
        [HttpGet]
        public ActionResult Index()
        {
            ViewBag.Data = new
                           {
                               model = UoW.RepoPais.All().ToResource()
                           };
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "Nombre,Codigo")] Pais model)
        {
            var errors = new List<string>();
            if (UoW.RepoPais.NombreVerify(model))  errors.Add("El nombre del país ya existe");
            if (UoW.RepoPais.CodigoVerify(model))  errors.Add("El código del país ya existe");
            if (errors.Any()) return UnprocessableEntity(errors);
            
            return SuccessResponse(UoW.RepoPais.Create(model).ToResource());
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "Id,Nombre,Codigo")] Pais model)
        {
            var errors = new List<string>();
            if (UoW.RepoPais.NombreVerify(model))  errors.Add("El nombre del país ya existe");
            if (UoW.RepoPais.CodigoVerify(model))  errors.Add("El código del país ya existe");
            if (errors.Any()) return UnprocessableEntity(errors);
            
            return SuccessResponse(UoW.RepoPais.Edit(model).ToResource());
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Delete(int id)
        {
            try
            {
                return SuccessResponse(UoW.RepoPais.Delete(id));
            }
            catch (Exception)
            {
                return Conflict();
            }
        }
    }
}