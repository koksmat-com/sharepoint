
import React from 'react';

import {TopNode} from './TopNode';
import { ComponentMeta, ComponentStory} from "@storybook/react"
import { NavigationNode } from '../helpers';
const left : NavigationNode[] = [
    {
      "Id": 2008,
      "Title": "Consumer Card Products",
      "Url": "http://linkless.header/",
      "IsDocLib": false,
      "IsExternal": false,
      "ParentId": 1025,
      "ListTemplateType": 0,
      "AudienceIds": null,
      "CurrentLCID": 1033,
      "Children": [
        {
          "Id": 2012,
          "Title": "Debit Card",
          "Url": "/sites/IssuerProducts/SitePages/Debit-Card(1).aspx",
          "IsDocLib": false,
          "IsExternal": false,
          "ParentId": 2008,
          "ListTemplateType": 0,
          "AudienceIds": null,
          "CurrentLCID": 1033,
          "Children": [
            {
              "Id": 2014,
              "Title": "Essential Service",
              "Url": "/sites/IssuerProducts/SitePages/Debit-Card---Essential-Services.aspx",
              "IsDocLib": false,
              "IsExternal": false,
              "ParentId": 2012,
              "ListTemplateType": 0,
              "AudienceIds": null,
              "CurrentLCID": 1033,
              "Children": [],
              "OpenInNewWindow": false
            }
          ],
          "OpenInNewWindow": null
        },
        {
          "Id": 2015,
          "Title": "Credit Card",
          "Url": "/sites/IssuerProducts/SitePages/Credit-Card.aspx",
          "IsDocLib": false,
          "IsExternal": false,
          "ParentId": 2008,
          "ListTemplateType": 0,
          "AudienceIds": null,
          "CurrentLCID": 1033,
          "Children": [
            {
              "Id": 2016,
              "Title": "Credit card essential",
              "Url": "/sites/IssuerProducts/SitePages/Credit-card-essential.aspx",
              "IsDocLib": false,
              "IsExternal": false,
              "ParentId": 2015,
              "ListTemplateType": 0,
              "AudienceIds": null,
              "CurrentLCID": 1033,
              "Children": [],
              "OpenInNewWindow": null
            }
          ],
          "OpenInNewWindow": null
        },
        {
          "Id": 2018,
          "Title": "Pre-Paid Card (coming...)",
          "Url": "http://linkless.header/",
          "IsDocLib": false,
          "IsExternal": false,
          "ParentId": 2008,
          "ListTemplateType": 0,
          "AudienceIds": null,
          "CurrentLCID": 1033,
          "Children": [],
          "OpenInNewWindow": false
        },
        {
          "Id": 2019,
          "Title": "Fraud Management (coming...)",
          "Url": "http://linkless.header/",
          "IsDocLib": false,
          "IsExternal": false,
          "ParentId": 2008,
          "ListTemplateType": 0,
          "AudienceIds": null,
          "CurrentLCID": 1033,
          "Children": [],
          "OpenInNewWindow": false
        },
        {
          "Id": 2020,
          "Title": "Dispute Management (coming...)",
          "Url": "http://linkless.header/",
          "IsDocLib": false,
          "IsExternal": false,
          "ParentId": 2008,
          "ListTemplateType": 0,
          "AudienceIds": null,
          "CurrentLCID": 1033,
          "Children": [],
          "OpenInNewWindow": false
        },
        {
          "Id": 2021,
          "Title": "3D Secure (coming...)",
          "Url": "http://linkless.header/",
          "IsDocLib": false,
          "IsExternal": false,
          "ParentId": 2008,
          "ListTemplateType": 0,
          "AudienceIds": null,
          "CurrentLCID": 1033,
          "Children": [],
          "OpenInNewWindow": false
        }
      ],
      "OpenInNewWindow": false
    },
    {
      "Id": 2009,
      "Title": "Commercial Card Products",
      "Url": "http://linkless.header/",
      "IsDocLib": false,
      "IsExternal": false,
      "ParentId": 1025,
      "ListTemplateType": 0,
      "AudienceIds": null,
      "CurrentLCID": 1033,
      "Children": [
        {
          "Id": 2017,
          "Title": "Corporate Card .- Credit",
          "Url": "http://linkless.header/",
          "IsDocLib": false,
          "IsExternal": false,
          "ParentId": 2009,
          "ListTemplateType": 0,
          "AudienceIds": null,
          "CurrentLCID": 1033,
          "Children": [],
          "OpenInNewWindow": false
        }
      ],
      "OpenInNewWindow": false
    },
    {
      "Id": 2010,
      "Title": "Personal Financing Products",
      "Url": "http://linkless.header/",
      "IsDocLib": false,
      "IsExternal": false,
      "ParentId": 1025,
      "ListTemplateType": 0,
      "AudienceIds": null,
      "CurrentLCID": 1033,
      "Children": [],
      "OpenInNewWindow": false
    }
  ]
export default {
    title: "Components/TopNode",
    component: TopNode,
} as ComponentMeta<typeof TopNode>
/*
export const Submit = () => <TopNavigation left={left} right={[]} />

export const Check = () => <TopNavigation  left={left} right={[]}/>
*/