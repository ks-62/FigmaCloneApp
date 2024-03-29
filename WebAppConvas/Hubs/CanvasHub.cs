﻿using Microsoft.AspNetCore.SignalR;
using WebAppConvas.Models;
using System.Text.RegularExpressions;
using System.Collections.Generic;

namespace WebAppConvas.Hubs
{
    public class CanvasHub: Hub
    {
        CoordinateList _crdList = new CoordinateList();

        public async Task SaveCoordinate(Coordinate crd)
        {
            try
            {
                List<Coordinate> crdList = new List<Coordinate>();

                if(string.IsNullOrEmpty(crd.Name))
                {
                    var figureList = CoordinateList.dataList
                        .Where(c => c.Figure == crd.Figure)
                        .Where(c => c.Name.StartsWith(crd.Figure)).ToList();

                    var list = figureList.Select(v => new { Name = v.Name, Index = ToInt(v.Name) })
                        .OrderBy(v => v.Index).Select(v => new { name = v.Name, index = v.Index }).ToList();

                    int indexInName = 0;
                    if(list.Count > 0)
                    {
                        indexInName = list[list.Count - 1].index;
                    }
                    
                    int newIndex = indexInName + 1;

                    string inputName = $"{crd.Figure}{newIndex}";

                    crd.Name = inputName;
                }

                if(string.IsNullOrEmpty(crd.FillColor))
                {
                    crd.FillColor = "#ffffff";
                }

                crdList.Add(crd);

                CoordinateList.dataList.Add(crd);

                var sortedList = CoordinateList.dataList.OrderBy(x => x.ZIndex);

                await Clients.All.SendAsync("ReceiveCoordinate", sortedList);

            }
            catch(Exception ex)
            {
                var reAry = new List<string>();
                reAry.Add(ex.ToString());
                await Clients.All.SendAsync("ReceiveCoordinate", reAry);
            }
        }

        public async Task RemoveCoordinate(Coordinate crd)
        {
            try
            {
                List<Coordinate> crdList = CoordinateList.dataList;
                crdList.RemoveAll(obj => obj.Name == crd.Name);
                CoordinateList.dataList = crdList;
            }
            catch(Exception ex)
            {
                var reAry = new List<string>();
                reAry.Add(ex.ToString());
                await Clients.All.SendAsync("ReceiveCoordinate", reAry);
            }
        }

        public async Task ClearCoordinate()
        {
            try
            {
                CoordinateList.dataList = new List<Coordinate>();

                await Clients.All.SendAsync("DeletedCoordinate", CoordinateList.dataList);
            }
            catch(Exception ex)
            {
                var reAry = new List<string>();
                reAry.Add(ex.ToString());
                await Clients.All.SendAsync("DeletedCoordinate", reAry);
            }
        }

        public async Task ChangeIndex(string crdName, int zIndx)
        {
            var sortedList = CoordinateList.dataList.OrderBy(x => x.ZIndex);

            bool incrementFlg = false;
            foreach(Coordinate crd in sortedList)
            {

                if (crd.ZIndex == zIndx) incrementFlg = true;

                if (incrementFlg)
                {
                    crd.ZIndex += 1;
                }

                if (crd.Name == crdName)
                {
                    crd.ZIndex = zIndx;
                }

            }

            await Clients.All.SendAsync("ReceiveCoordinate", sortedList);
        }


        public int ToInt(string txt)
        {
            return int.Parse(Regex.Replace(txt, @"[^0-9]", ""));
        }

    }

}
